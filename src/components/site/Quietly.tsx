"use client";

import * as React from "react";

/*
 * Wraps the WebGL scenes. If a texture fails to load or WebGL gives up, the
 * scene simply is not there: whatever was drawn underneath it stands on its
 * own. A thrown error inside a canvas would otherwise take the page with it.
 */
export class Quietly extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? null : this.props.children;
  }
}
