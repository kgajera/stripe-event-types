import React, { useEffect, useRef, useState } from "react";
import { useColorMode } from "@docusaurus/theme-common";
import sdk, { EmbedOptions, VM } from "@stackblitz/sdk";

interface StackBlitzEmbedProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  projectId: string;
  options?: EmbedOptions;
}

export function StackBlitzEmbed({
  options = {},
  projectId,
  ...props
}: StackBlitzEmbedProps): JSX.Element {
  const element = useRef(null);
  const [vm, setVm] = useState<VM>();
  const { colorMode } = useColorMode();

  useEffect(() => {
    sdk
      .embedProjectId(element.current, projectId, {
        height: 700,
        theme: colorMode,
        ...options,
      })
      .then(setVm);
  }, []);

  vm?.editor.setTheme(colorMode);

  return <div ref={element} {...props} />;
}
