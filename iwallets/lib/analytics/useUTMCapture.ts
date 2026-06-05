"use client";

import { useEffect } from "react";
import { captureUTMParameters } from "./utm";
import { captureClickIds } from "./click-ids";
import { getVisitorId } from "./visitor-id";

export function useUTMCapture(): void {
  useEffect(() => {
    captureUTMParameters();
    captureClickIds();
    getVisitorId();
  }, []);
}
