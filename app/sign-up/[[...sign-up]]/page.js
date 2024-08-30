import React from 'react'
import { Box, Typography, AppBar, Stack, Button } from '@mui/material'
import { SignUp } from '@clerk/nextjs'
import { Lilita_One } from "next/font/google";

const lilita_one = Lilita_One({
    weight: '400',
    style: 'normal',
    subsets: ['latin']
})

export default function SignUpPage() {
  return (
    <Box
        width="100vw"
        height="100vh"
        bgcolor='#FCE2DB'
    >
        <Box
            display='flex'
            direction='row'
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
            marginLeft={9}
            marginRight={9}
        >
            <Button color="inherit" href="/" sx={{textTransform: 'none'}}>
                <Typography
                    variant='h1'
                    color='#432C7A'
                    sx={{
                        fontFamily: lilita_one.style.fontFamily,
                        fontSize: '4rem',
                        maxWidth: '200px'
                        
                    }}
                >
                    GradeMyProf
                </Typography>
            </Button>
            <Stack
                direction='row'
                spacing={1}
                justifyContent='center'
                alignItems='center'
                sx={{
                    // backgroundColor: '#80489C',
                    backgroundColor: '#432C7A',
                }}
                // my={2}
                p={1}
                px={1}
                borderRadius={10}
            >
                    
                <Button variant='contained'
                    sx={{
                        // background: '#FF8FB1',
                        background: '#80489C',
                        '&:hover': {
                            backgroundColor: '#9A1750',
                            borderRadius: 8
                        },
                        borderRadius: 12,
                    }}
                    href="/sign-in"
                >
                    Sign In
                </Button>
            </Stack>
        </Box>
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            sx={{textAlign: 'center', my: 4}}
            
            >
            <Typography 
                variant="h1" 
                gutterBottom
                sx={{
                    fontSize: '5rem',
                    fontFamily: lilita_one.style.fontFamily
                }}
            >
                Sign Up
            </Typography>
            <SignUp />
        </Box>
    </Box>
  )
}