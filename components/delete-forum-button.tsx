"use client"

import { DeleteForumAction } from "@/components/delete-forum-action"
import type { ReactNode } from "react"

/**
 * DeleteForumButton – wrapper component that forwards all props to DeleteForumAction.
 * This file resolves missing imports of '@/components/delete-forum-button' in pages.
 */
export function DeleteForumButton({
  id,
  type,
  topicId = null,
  courseId = null,
}: {
  id: string,
  type: "topic" | "reply" | "TOPIC" | "REPLY",
  topicId?: string | null,
  courseId?: string | null,
}) {
  const normalizedType = (type.toUpperCase()) as "TOPIC" | "REPLY"
  return (
    <DeleteForumAction
      id={id}
      type={normalizedType}
      topicId={topicId}
      courseId={courseId}
    />
  )
}
