import dynamic from 'next/dynamic'
import React from 'react'

type ChildrenType =
  | string
  | number
  | boolean
  | React.ReactElement<any, string | React.JSXElementConstructor<any>>
  | Iterable<React.ReactNode>
  | React.ReactPortal
  | null
  | undefined

const NoSsr = (props: { children: ChildrenType }) => <React.Fragment>{props.children}</React.Fragment>

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
})
