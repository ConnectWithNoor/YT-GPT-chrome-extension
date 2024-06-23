import React from "react"

import { Collapsible } from "./ui/collapsible"

type Props = {}

function Extension({}: Props) {
  return (
    <main className="antialiased w-full mb-3 z-10">
      <div className="w-full">
        <Collapsible className="space-y-3">
          <h1>Extension Actions</h1>
        </Collapsible>
      </div>
    </main>
  )
}

export default Extension
