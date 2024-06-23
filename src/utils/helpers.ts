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
  // @ts-ignore
  let player = window.ytInitialPlayerResponse
  if (!player || id !== player.videoDetails.videoId) {
    // if the player is not available or the video id is different, fetch the video page to get the player response
    const pageData = await fetch(`https://www.youtube.com/watch?v=${id}`) //getting the YT video page and parsing it to get the required info
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
