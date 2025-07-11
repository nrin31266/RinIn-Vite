import Button from '@mui/material/Button';
import React from 'react'

interface Props{
  onOauthClick: () => void;
}

const OtherLogin = ({ onOauthClick }: Props) => {
  return (
    <div>
      <Button
      
        variant="outlined"
        color="primary"
        size="large"
        fullWidth
        onClick={onOauthClick}
        endIcon={<img src="/gg.png" alt="Google Icon" width="24" height="24" />}
      >
        Google
      </Button>
    </div>
  )
}

export default OtherLogin
