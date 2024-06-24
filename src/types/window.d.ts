interface Window {
  ytInitialPlayerResponse:
    | {
        videoDetails: {
          title: string
          lengthSeconds: string
          videoId: string
          author: string
          viewCount: string
        }
        captions:
          | {
              playerCaptionsTracklistRenderer:
                | {
                    captionTracks: {
                      baseUrl: string
                      name: {
                        simpleText: string
                      }
                      languageCode: string
                      kind: string
                    }[]
                  }
                | undefined
            }
          | undefined
      }
    | undefined
}
