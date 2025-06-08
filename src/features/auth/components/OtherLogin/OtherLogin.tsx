import Button from '@mui/material/Button';
import React from 'react'

const OtherLogin = () => {
  return (
    <div>
      <Button
        variant="outlined"
        color="primary"
        size="large"
        fullWidth
        onClick={() => {
          
        }}
        endIcon={<img src="/gg.png" alt="Google Icon" width="24" height="24" />}
      >
        Google
      </Button>
    </div>
  )
}

export default OtherLogin