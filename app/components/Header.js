'use client';
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { Lilita_One } from "next/font/google";

const lilita_one = Lilita_One({
  weight: '400',
  style: 'normal',
  subsets: ['latin']
})



export default function Header(){
    const [ section, setSection ] = useState('home');

    return(
        <Box
            display='flex'
            direction='row'
            spacing={2}
            justifyContent='space-between'
            alignItems='center'
            sx={{
                // backgroundColor: '#80489C',
                backgroundColor: '#432C7A',
            }}
            // my={2}
            p={1}
            px={4}
            borderRadius={10}
        >
            <Typography
                variant='h4'
                color='#FCE2DB'
                sx={{
                    fontFamily: lilita_one.style.fontFamily
                }}
            >
                GradeMyProf
            </Typography>
            <Stack
                direction='row'
                spacing={2}
                justifyContent='center'
                alignItems='center'
                color='#FCE2DB'
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
                    onClick={() => setSection('contact')}
                    style={{cursor: 'pointer'}}
                >Contact</Typography>
            </Stack>
            <Stack
                direction='row'
                spacing={2}
                justifyContent='center'
                alignItems='center'
            >
                <Button variant='contained'>
                    Sign In
                </Button>
                <Button variant='contained'>
                    Sign Up
                </Button>
            </Stack>
        </Box>
    );

}