import * as React from 'react';
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

export default function LoadingMask({
  isShow = false
}: {
  isShow: boolean
}) {
  return <Backdrop
    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
    open={isShow}
  >
    <CircularProgress color="inherit" />
  </Backdrop>
}