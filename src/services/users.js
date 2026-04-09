import API from './api'

export const fetchUserPermissions = async (userId) => {
  const res = await API.get(`/auth/admin/users/${userId}/permissions`)
  return res.data
}

export const toggleUserSection = async (userId, builder, section, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/${builder}/${section}/toggle`, { isActive })
  return res.data
}

export const toggleUserItem = async (userId, builder, section, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/${builder}/${section}/${itemId}`, { isActive })
  return res.data
}

export const toggleUserDetailsSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/video/details/toggle`, { isActive })
  return res.data
}

export const toggleUserDetailsGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/video/details/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleUserDetailsOpt = async (userId, groupId, optId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/video/details/groups/${groupId}/opts/${optId}`, { isActive })
  return res.data
}

export const toggleCharacterSection = async (userId, section, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/character/${section}/toggle`, { isActive })
  return res.data
}

export const toggleCharacterItem = async (userId, section, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/character/${section}/${itemId}`, { isActive })
  return res.data
}

export const toggleCharacterDetailsSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/character/details/toggle`, { isActive })
  return res.data
}

export const toggleCharacterDetailsGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/character/details/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleCharacterDetailsOpt = async (userId, groupId, optId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/character/details/groups/${groupId}/opts/${optId}`, { isActive })
  return res.data
}

export const toggleMusicSection = async (userId, section, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/music/${section}/toggle`, { isActive })
  return res.data
}

export const toggleMusicItem = async (userId, section, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/music/${section}/${itemId}`, { isActive })
  return res.data
}

export const toggleMusicDetailsSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/music/details/toggle`, { isActive })
  return res.data
}

export const toggleMusicDetailsGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/music/details/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleMusicDetailsOpt = async (userId, groupId, optId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/music/details/groups/${groupId}/opts/${optId}`, { isActive })
  return res.data
}

export const toggleStoryboardSection = async (userId, section, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/storyboard/${section}/toggle`, { isActive })
  return res.data
}

export const toggleStoryboardItem = async (userId, section, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/storyboard/${section}/${itemId}`, { isActive })
  return res.data
}

export const toggleStoryboardDetailsSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/storyboard/details/toggle`, { isActive })
  return res.data
}

export const toggleStoryboardDetailsGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/storyboard/details/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleStoryboardDetailsOpt = async (userId, groupId, optId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/storyboard/details/groups/${groupId}/opts/${optId}`, { isActive })
  return res.data
}

export const toggleImageSection = async (userId, section, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/${section}/toggle`, { isActive })
  return res.data
}

export const toggleImageItem = async (userId, section, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/${section}/${itemId}`, { isActive })
  return res.data
}

export const toggleImageDetailsSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/details/toggle`, { isActive })
  return res.data
}

export const toggleImageDetailsGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/details/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleImageDetailsOpt = async (userId, groupId, optId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/details/groups/${groupId}/opts/${optId}`, { isActive })
  return res.data
}

export const toggleImageCategoriesSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/categories/toggle`, { isActive })
  return res.data
}

export const toggleImageCategoriesGroup = async (userId, groupId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/categories/groups/${groupId}`, { isActive })
  return res.data
}

export const toggleImageCategoriesItem = async (userId, groupId, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/image/categories/groups/${groupId}/items/${itemId}`, { isActive })
  return res.data
}

export const toggleNavSection = async (userId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/nav/toggle`, { isActive })
  return res.data
}

export const toggleNavItem = async (userId, itemId, isActive) => {
  const res = await API.patch(`/auth/admin/users/${userId}/permissions/nav/items/${itemId}`, { isActive })
  return res.data
}