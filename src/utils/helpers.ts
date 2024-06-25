import { YT_INITIAL_PLAYER_RESPONSE_REGEX } from "./constants"

export const getVideoId = () => {
  return new URLSearchParams(window.location.search).get("v")
}

export const compareTracks = (track1, track2) => {
  const langCode1 = track1.languageCode
  const langCode2 = track2.languageCode

  if (langCode1 === "en" && langCode2 !== "en") {
    return -1 // english comes first
  } else if (langCode1 !== "en" && langCode2 === "en") {
    return 1 // english comes first
  } else if (track1.kind !== "asr" && track2.kind === "asr") {
    return -1 // non-asr comes first
  } else if (track1.kind === "asr" && track2.kind !== "asr") {
    return 1 // non-asr comes first
  }

  return 0 // both are same
}

export const getCSSVariable = (name: string) => {
  // https://developer.mozilla.org/en-US/docs/Web/API/Window/getComputedStyle
  // getComputedStyle gets the values of all the CSS properties of an element. It is the window object's method.
  const rootStyle = getComputedStyle(document.documentElement)
  return rootStyle.getPropertyValue(name).trim()
}

export const getVideoData = async (id: string) => {
  let player = window.ytInitialPlayerResponse // ytInitialPlayerResponse comes from Youtube's video page, the window object is extended to have this property
  //   in case YT video pages doesn't have the ytInitialPlayerResponse, we fetch the video page and parse it to get the required info
  if (!player || id !== player.videoDetails.videoId) {
    const pageData = await fetch(`https://www.youtube.com/watch?v=${id}`) //getting the YT video page
    const body = await pageData.text() // getting the text of the page
    const playerResponseMatch = body.match(YT_INITIAL_PLAYER_RESPONSE_REGEX) // matching the player response

    if (!playerResponseMatch) {
      console.warn("Could not find player response")
      return
    }

    player = JSON.parse(playerResponseMatch[1]) // parsing the player response
  }

  const metadata = {
    title: player.videoDetails.title,
    duration: player.videoDetails.lengthSeconds,
    author: player.videoDetails.author,
    views: player.videoDetails.viewCount
  }

  if (player.captions && player.captions.playerCaptionsTracklistRenderer) {
    const tracks = player.captions.playerCaptionsTracklistRenderer.captionTracks // getting the captions

    if (tracks && tracks.length > 0) {
      // if captions exists
      // sorting the tracks.
      tracks.sort(compareTracks) // sorting the tracks based on the compareTracks function
      const transcriptResponse = await fetch(tracks[0].baseUrl + "&fmt=json3") // fetching the transcript
      const transcript = await transcriptResponse.json()

      return { metadata, transcript }
    }
  }
  return { metadata, transcript: null } // if no captions, return null for transcript
}

export const CopyVideoURL = (
  isCopied: boolean,
  copyToClipboard: (href: string) => void
) => {
  if (isCopied) return
  copyToClipboard(window.location.href)
}

export const cleanJSONTranscript = (transcript: any) => {
  // this function is used to convert the transcript from JSON to a clean text format that we can use inside the transcript tab in the extension
  const chunks = []

  let currentChunk = ""
  let currentStartTime = transcript.events[0].tStartMs
  let currentEndTime = ""

  transcript.events.forEach((event) => {
    event.segs?.forEach((seg) => {
      const segmentText = seg.utf8.replace("/\n/g", " ") // replacing new lines with space
      currentEndTime = event.tStartMs + (seg.tOffsetMs || 0) // calculating the end time of the segment
      if ((currentChunk + segmentText).length > 300) {
        chunks.push({
          text: currentChunk.trim(),
          startTime: currentStartTime,
          endTime: currentEndTime
        })

        currentChunk = segmentText
        currentStartTime = currentEndTime
      } else {
        currentChunk += segmentText
      }
    })
  })

  if (currentChunk) {
    chunks.push({
      text: currentChunk.trim(),
      startTime: currentStartTime,
      endTime: currentEndTime
    })
  }

  return chunks
}

export const cleanTextTranscript = (transcript: any) => {
  let textLines = []
  let tempText = ""
  let lastTime = 0

  transcript.events.forEach((event) => {
    event.segs?.forEach((seg) => {
      const segmentStartTimeMs = event.startMs + (seg.tOffsetMs || 0)

      if (
        tempText &&
        (segmentStartTimeMs - lastTime > 1000 || seg.utf8 === "\n")
      ) {
        const timeFormatted = new Date(lastTime).toISOString().substr(11, 12)
        textLines.push(`${timeFormatted}: ${tempText.trim()}`)
        tempText = ""
      }
      lastTime = segmentStartTimeMs
      tempText += seg.utf8
    })
  })

  if (tempText) {
    const timeFormatted = new Date(lastTime).toISOString().substr(11, 12)
    textLines.push(`${timeFormatted}: ${tempText.trim()}`)
  }

  return textLines.join("\n")
}
