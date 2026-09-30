import axios from 'axios'

export type Post = {
  id: number
  userId: number
  title: string
  body: string
}

export type Author = {
  id: number
  name: string
  username: string
  email: string
}

export type Comment = {
  id: number
  postId: number
  name: string
  email: string
  body: string
  approved?: boolean
}

const api = axios.create({ baseURL: 'https://jsonplaceholder.typicode.com' })

export async function getPosts() {
  return (await api.get<Post[]>('/posts')).data
}

export async function createPost(post: Omit<Post, 'id'>) {
  return (await api.post<Post>('/posts', post)).data
}

export async function getPost(id: number) {
  return (await api.get<Post>(`/posts/${id}`)).data
}

export async function getAuthors() {
  return (await api.get<Author[]>('/users')).data
}

export async function getAuthor(id: number) {
  return (await api.get<Author>(`/users/${id}`)).data
}

export async function getAuthorPosts(id: number) {
  return (await api.get<Post[]>(`/users/${id}/posts`)).data
}

export async function getPostComments(id: number) {
  return (await api.get<Comment[]>(`/posts/${id}/comments`)).data
}

export async function sendComment(comment: Omit<Comment, 'id'>) {
  return (await api.post<Comment>('/comments', comment)).data
}