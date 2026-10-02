import { RelativePathString, router, useLocalSearchParams } from 'expo-router'
import {
  Text,
  StyleSheet,
  useColorScheme,
  View,
  Image,
  ScrollView,
  Pressable,
  Dimensions,
  Share,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Linking from 'expo-linking'
import Animated, { useAnimatedStyle, useSharedValue, withDelay, withSpring, withTiming, Easing } from 'react-native-reanimated'
import Main from '@/components/ui/main'
import { Colors } from '@/constants/Colors'
import { GlassSurface } from '@/components/ui/glass-view'
import { Motion, Radius, Spacing, Typography } from '@/constants/Theme'
import { useEffect, useState } from 'react'
import { API_URL } from '@/constants/config'
import * as SecureStore from 'expo-secure-store'
import { DetailedTopic, PendingEnrollment } from '@/lib/interfaces'
import { profileImages } from '@/assets/profile-images'
import Feather from '@expo/vector-icons/Feather'
import Post from '@/components/post'
import { useAuth } from '@/hooks/useAuth'
import { FloatingButton } from '@/components/fab'
import QuickPostSheet from '@/components/forms/quick-post-sheet'

const { width } = Dimensions.get('window')

function TopBarButton({ name, onPress, theme }: { name: keyof typeof Feather.glyphMap, onPress: () => void, theme: 'light' | 'dark' }) {
  const scale = useSharedValue(1)
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }))

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(Motion.pressScale, Motion.spring) }}
        onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
        onPress={onPress}
      >
        <GlassSurface tint={theme} radius={Radius.pill} style={styles.topBarButton}>
          <Feather name={name} size={18} color={Colors[theme].text} />
        </GlassSurface>
      </Pressable>
    </Animated.View>
  )
}

function SectionLabel({ icon, label, theme }: { icon: keyof typeof Feather.glyphMap, label: string, theme: 'light' | 'dark' }) {
  return (
    <View style={styles.sectionLabel}>
      <Feather name={icon} size={14} color={Colors[theme].textSecondary} />
      <Text style={[styles.sectionLabelText, { color: Colors[theme].textSecondary }]}>{label}</Text>
    </View>
  )
}

function PostRow({ post, theme, index, onPress }: { post: any, theme: 'light' | 'dark', index: number, onPress: () => void }) {
  const scale = useSharedValue(1)
  const entrance = useSharedValue(0)

  useEffect(() => {
    entrance.value = withDelay(
      Math.min(index, 8) * 50,
      withTiming(1, { duration: Motion.durationBase, easing: Easing.out(Easing.cubic) })
    )
  }, [])

  // No opacity here: wraps a GlassSurface, and animating opacity on a GlassView or
  // its ancestors breaks/crashes native Liquid Glass (expo/expo#50097).
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: (1 - entrance.value) * 12 },
      { scale: scale.value },
    ],
  }))

  return (
    <Animated.View style={animatedStyle}>
      <Pressable
        onPressIn={() => { scale.value = withSpring(0.98, Motion.spring) }}
        onPressOut={() => { scale.value = withSpring(1, Motion.spring) }}
        onPress={onPress}
      >
        <GlassSurface tint={theme} radius={Radius.lg} style={styles.postContainer}>
          <View style={[styles.postIconContainer, { backgroundColor: Colors[theme].primary }]}>
            <Feather name="book-open" color={'#fff'} size={22} />
          </View>
          <View style={[styles.postContentContainer]}>
            <Text style={[styles.postTitle, { color: Colors[theme].text }]}>
              {post.title}
            </Text>
            <Text style={[Typography.small, { color: Colors[theme].textSecondary }]}>
              {new Date(post.createdAt!).getDay()}/
              {new Date(post.createdAt!).getMonth() + 1} -{' '}
              {new Date(post.createdAt!).getHours()}:
              {new Date(post.createdAt!).getMinutes()}
            </Text>
          </View>
        </GlassSurface>
      </Pressable>
    </Animated.View>
  )
}

function PendingRequestRow({
  request,
  theme,
  onAccept,
  onDeny,
}: {
  request: PendingEnrollment
  theme: 'light' | 'dark'
  onAccept: () => void
  onDeny: () => void
}) {
  return (
    <GlassSurface tint={theme} radius={Radius.lg} style={styles.requestContainer}>
      <Image source={profileImages[request.user.photo]} style={styles.requestAvatar} />
      <View style={styles.requestInfo}>
        <Text style={[Typography.bodyStrong, { color: Colors[theme].text }]} numberOfLines={1}>
          {request.user.name}
        </Text>
        <Text style={[Typography.small, { color: Colors[theme].textSecondary }]} numberOfLines={1}>
          {request.user.email}
        </Text>
      </View>
      <View style={styles.requestActions}>
        <Pressable
          onPress={onDeny}
          style={[styles.requestButton, { backgroundColor: Colors[theme].input }]}
        >
          <Feather name="x" size={16} color={Colors[theme].error} />
        </Pressable>
        <Pressable
          onPress={onAccept}
          style={[styles.requestButton, { backgroundColor: Colors[theme].primary }]}
        >
          <Feather name="check" size={16} color="#fff" />
        </Pressable>
      </View>
    </GlassSurface>
  )
}

export default function TopicDetails() {
  const [topic, setTopic] = useState<DetailedTopic>()
  const [postIsVisible, setPostIsVisible] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState<string>()
  const [quickPostVisible, setQuickPostVisible] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingRequests, setPendingRequests] = useState<PendingEnrollment[]>([])
  const { user } = useAuth()
  const { id } = useLocalSearchParams()
  const theme = useColorScheme() === 'light' ? 'light' : 'dark'
  const isOwner = user?.id === topic?.ownerId

  const loadTopic = async (topicId: string) => {
    const token = await SecureStore.getItemAsync('authToken')
    const result = await fetch(`${API_URL}/topics/topic?id=${topicId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    const data = await result.json()
    setTopic(data)
  }

  const loadPendingRequests = async (topicId: string) => {
    const token = await SecureStore.getItemAsync('authToken')
    const result = await fetch(`${API_URL}/enrollments/pending?topicId=${topicId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    if (result.ok) {
      setPendingRequests(await result.json())
    }
  }

  const resolveRequest = async (enrollmentId: string, action: 'accept' | 'deny') => {
    const token = await SecureStore.getItemAsync('authToken')
    await fetch(`${API_URL}/enrollments/${action}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: enrollmentId }),
    })

    if (typeof id === 'string') {
      loadPendingRequests(id)
      if (action === 'accept') loadTopic(id)
    }
  }

  useEffect(() => {
    if (typeof id === 'string' && isOwner) {
      loadPendingRequests(id)
    }
  }, [id, isOwner])

  useEffect(() => {
    if (typeof id === 'string') {
      loadTopic(id)
    }
  }, [id])

  function onPress() {
    setModalOpen((curr) => !curr)
  }

  const goBack = () => {
    if (router.canGoBack()) {
      router.back()
    } else {
      router.replace('/' as RelativePathString)
    }
  }

  return (
    <SafeAreaView style={styles.page} edges={['top']}>
      <Main onLoad={() => loadTopic(id as string)}>
        <View style={styles.optionsContainer}>
          <TopBarButton name="arrow-left" onPress={goBack} theme={theme} />
          <View style={styles.optionsGroup}>
            {!!topic?.chatId && (
              <TopBarButton
                name="message-circle"
                theme={theme}
                onPress={() => router.push(`/chat/${topic.chatId}` as RelativePathString)}
              />
            )}
            {isOwner && (
              <>
                <TopBarButton
                  name="plus"
                  theme={theme}
                  onPress={() => setQuickPostVisible(true)}
                />
                <TopBarButton
                  name="share"
                  theme={theme}
                  onPress={() => {
                    // Linking.createURL resolves to the right protocol for however
                    // this build is running (exp:// in Expo Go during development,
                    // the app's own learnloop:// scheme in a standalone build).
                    const joinLink = Linking.createURL(`/join/${topic?.id}`)
                    Share.share({
                      message: `¡Hola! Te invito a unirte a mi clase "${topic?.title}" en Learn Loop. Abre este enlace para unirte: ${joinLink}`,
                    })
                  }}
                />
              </>
            )}
          </View>
        </View>
        {topic ? (
          <View style={[styles.container]}>
            <GlassSurface tint={theme} radius={Radius.xl} style={styles.hero}>
              <Text style={[styles.title, { color: Colors[theme].text }]}>
                {topic?.title}
              </Text>
              <Text style={[Typography.body, { color: Colors[theme].textSecondary }]}>
                {topic?.description}
              </Text>
            </GlassSurface>

            {isOwner && pendingRequests.length > 0 && (
              <>
                <SectionLabel icon="user-plus" label={`Solicitudes pendientes (${pendingRequests.length})`} theme={theme} />
                <View style={styles.requestsList}>
                  {pendingRequests.map((request) => (
                    <PendingRequestRow
                      key={request.id}
                      request={request}
                      theme={theme}
                      onAccept={() => resolveRequest(request.id, 'accept')}
                      onDeny={() => resolveRequest(request.id, 'deny')}
                    />
                  ))}
                </View>
              </>
            )}

            <SectionLabel icon="users" label="Miembros" theme={theme} />
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={[styles.profilesContainer]}
            >
              {topic.users.map((user, index) => {
                return (
                  <View
                    key={index}
                    style={[
                      styles.profileImageContainer,
                      {
                        backgroundColor: Colors[theme].primaryBackground,
                        borderColor: Colors[theme].primaryBorder,
                      },
                    ]}
                  >
                    <Image
                      source={profileImages[user.photo]}
                      style={styles.profileImage}
                    />
                  </View>
                )
              })}
            </ScrollView>

            <SectionLabel icon="book-open" label="Contenido" theme={theme} />
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={[styles.postsContainer]}
            >
              {topic.posts.length > 0 ? (
                topic.posts.map((post, index) => (
                  <PostRow
                    key={index}
                    post={post}
                    theme={theme}
                    index={index}
                    onPress={() => {
                      setSelectedPostId(post.id)
                      setPostIsVisible(true)
                    }}
                  />
                ))
              ) : (
                <Text style={[Typography.small, { color: Colors[theme].textSecondary }]}>
                  Todavía no hay contenido en este tema.
                </Text>
              )}
            </ScrollView>
          </View>
        ) : (
          <Text style={[{ color: Colors[theme].text }]}>
            No hay tema con este ID
          </Text>
        )}
      </Main>

      {isOwner && (
        <FloatingButton onPress={onPress} style={{ bottom: 110, right: 30 }} topicId={typeof id == 'string' ? id : id[0]}/>
      )}

      <Post
        isVisible={postIsVisible}
        onClose={() => setPostIsVisible(false)}
        colorScheme={theme}
        currentPostId={selectedPostId!}
      />

      {topic && (
        <QuickPostSheet
          topic={topic}
          isVisible={quickPostVisible}
          onClose={() => setQuickPostVisible(false)}
          onPosted={() => loadTopic(topic.id)}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  optionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  optionsGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  topBarButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.md,
  },
  hero: {
    padding: Spacing.lg,
    gap: Spacing.xs,
  },
  title: {
    ...Typography.title,
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  sectionLabelText: {
    ...Typography.label,
    fontWeight: '600',
    textTransform: 'none',
  },
  profilesContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  profileImageContainer: {
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderRadius: Radius.pill,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: Radius.pill,
  },
  postsContainer: {
    display: 'flex',
    flexDirection: 'column',
  },
  postContainer: {
    width: width * 0.9,
    padding: Spacing.md,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  postIconContainer: {
    padding: Spacing.md,
    borderRadius: Radius.sm,
  },
  postContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: Spacing.xs,
  },
  postTitle: {
    ...Typography.bodyStrong,
  },
  requestsList: {
    gap: Spacing.sm,
  },
  requestContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm,
  },
  requestAvatar: {
    width: 44,
    height: 44,
    borderRadius: Radius.pill,
  },
  requestInfo: {
    flex: 1,
    gap: 2,
  },
  requestActions: {
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  requestButton: {
    width: 32,
    height: 32,
    borderRadius: Radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
})
