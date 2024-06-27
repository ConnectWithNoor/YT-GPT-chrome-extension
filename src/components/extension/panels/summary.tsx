import React from "react";

import SummaryActions from "./summary-action";
import SummaryContent from "./summary-content";

type Props = {};

function Summary({}: Props) {
  return (
    <>
      <SummaryActions />
      <SummaryContent />
    </>
  );
}

export default Summary;
