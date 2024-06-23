import Extension from "@/components/extension"
import Provider from "@/providers/provider"
import styleText from "data-text:@/style.css"
import type {
  PlasmoCSConfig,
  PlasmoGetInlineAnchor,
  PlasmoGetShadowHostId,
  PlasmoGetStyle
} from "plasmo"

// https://docs.plasmo.com/framework/content-scripts-ui/styling#import-stylesheet
export const getStyle: PlasmoGetStyle = () => {
  // converting rem to px
  const baseFontSize = 12
  let updatedCssText = styleText.replaceAll(":root", ":host(plasmo-csui)")
  const remRegex = /([\d.]+)rem/g
  updatedCssText = updatedCssText.replace(remRegex, (match, remValue) => {
    const pixels = parseFloat(remValue) * baseFontSize
    return `${pixels}px`
  })

  const style = document.createElement("style")
  style.textContent = updatedCssText
  return style
}

// https://docs.plasmo.com/framework/content-scripts#config
// https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts#static-declarative
export const config: PlasmoCSConfig = {
  matches: ["https://www.youtube.com/*"]
}

const INJECTED_ELEMENT_ID = "#secondary-inner.style-scope.ytd-watch-grid"

// This function is called to get the UI element where the content script UI should be injected.
// https://docs.plasmo.com/framework/content-scripts-ui/life-cycle#inline
export const getInlineAnchor: PlasmoGetInlineAnchor = async () => ({
  element: document.querySelector(INJECTED_ELEMENT_ID),
  insertPosition: "beforebegin"
})

// https://docs.plasmo.com/framework/content-scripts-ui/life-cycle#detecting-and-optimizing-root-container-removal
// This function is called to detect the ROOT container removal and optimize the cleanup process.
export const getShadowHostId: PlasmoGetShadowHostId = () => `plasmo-inline`

function MainUI() {
  return (
    <Provider>
      <Extension />
    </Provider>
  )
}

export default MainUI
