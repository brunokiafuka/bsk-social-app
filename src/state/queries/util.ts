import {QueryClient, QueryKey, InfiniteData} from '@tanstack/react-query'
import {
  AppBskyEmbedRecord,
  AppBskyEmbedRecordWithMedia,
  AppBskyFeedDefs,
  AppBskyFeedPost,
} from '@atproto/api'

export function truncateAndInvalidate<T = any>(
  queryClient: QueryClient,
  queryKey: QueryKey,
) {
  queryClient.setQueriesData<InfiniteData<T>>({queryKey}, data => {
    if (data) {
      return {
        pageParams: data.pageParams.slice(0, 1),
        pages: data.pages.slice(0, 1),
      }
    }
    return data
  })
  queryClient.invalidateQueries({queryKey})
}

export function getEmbeddedPost(
  v: unknown,
): AppBskyEmbedRecord.ViewRecord | undefined {
  if (
    AppBskyEmbedRecord.isView(v) &&
    AppBskyEmbedRecord.validateView(v).success
  ) {
    if (
      AppBskyEmbedRecord.isViewRecord(v.record) &&
      AppBskyFeedPost.isRecord(v.record.value) &&
      AppBskyFeedPost.validateRecord(v.record.value).success
    ) {
      return v.record
    }
  }
  if (
    AppBskyEmbedRecordWithMedia.isView(v) &&
    AppBskyEmbedRecordWithMedia.validateView(v).success
  ) {
    if (
      AppBskyEmbedRecord.isViewRecord(v.record.record) &&
      AppBskyFeedPost.isRecord(v.record.record.value) &&
      AppBskyFeedPost.validateRecord(v.record.record.value).success
    ) {
      return v.record.record
    }
  }
}

export function embedViewRecordToPostView(
  v: AppBskyEmbedRecord.ViewRecord,
): AppBskyFeedDefs.PostView {
  return {
    uri: v.uri,
    cid: v.cid,
    author: v.author,
    record: v.value,
    indexedAt: v.indexedAt,
    labels: v.labels,
  }
}
