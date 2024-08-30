'use client';
import { Box, Button, Stack, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { Lilita_One } from "next/font/google";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const lilita_one = Lilita_One({
  weight: '400',
  style: 'normal',
  subsets: ['latin']
})



export default function Header(){
    const [ section, setSection ] = useState('home');

    const handleChange = (event, newValue) => {
        setSection(newValue);
    };

    return(
        <Box
            display='flex'
            direction='row'
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
            
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
                spacing={2}
                justifyContent='center'
                alignItems='center'
                color='#FCE2DB'
                sx={{
                    // backgroundColor: '#80489C',
                    backgroundColor: '#80489C',
                }}
                // my={2}
                p={1.5}
                px={4}
                borderRadius={10}
            >
                <Typography
                    onClick={() => setSection('home')}
                    style={{cursor: 'pointer'}}
                >Home</Typography>
                <Typography
                    onClick={() => setSection('about')}
                    style={{cursor: 'pointer'}}
                >About</Typography>
                <Typography
                    onClick={() => window.location.href = '/contact'}
                    style={{cursor: 'pointer'}}
                >Contact</Typography>
            </Stack>
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
                <SignedOut>
                    <Button variant='contained'
                        sx={{
                            // background: '#FF8FB1',
                            background: '#80489C',
                            '&:hover': {
                                backgroundColor: '#9A1750',
                                borderRadius: 10
                            },
                            borderRadius: 10,
                        }}
                        href="/sign-in"
                    >
                        Sign In
                    </Button>
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
                        href="/sign-up"
                    >
                        Sign Up
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton />
                </SignedIn>
            </Stack>
        </Box>
    );

}