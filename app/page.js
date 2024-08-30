'use client';
import { Typography, Box, Stack, Button, Container } from "@mui/material";
import Image from "next/image";
import Header from "./components/Header";
import { Lilita_One } from "next/font/google";
import { SignedOut, SignedIn } from "@clerk/nextjs";

const lilita_one = Lilita_One({
  weight: '400',
  style: 'normal',
  subsets: ['latin']
})

export default function Home() {
  return (
    <Box
      width='100vw'
      height='100vh'
      // bgcolor='#FCE2DB'
      bgcolor='#FCE2DB'

      px={8}
    >
      <Header />
      <Box
        width='100%'
        display='flex'
        justifyContent='center'
        alignItems='center'
        flexDirection='column'
        my={8}
        >
          <Stack
            width='100%'
            direction='row'
            spacing={2}
            justifyContent='space-between'
            mx={8}
          >
            <Stack
              direction='column'
              spacing={2}
              justifyContent='center'
              alignItems='flex-start'
              gap={5}
            >
              <Typography
                variant='h2'
                // color='#432C7A' 
                color='#FF8FB1'
                sx={{
                  fontFamily: lilita_one.style.fontFamily
                }}
              >
                Empowering<br/>
                Students, One <br/>
                Review at a Time.
              </Typography>
              <Typography
                variant='body1'
                color='#80489C'
                sx={{
                  fontFamily: 'sans-serif',
                  maxWidth: '550px'
                }}
              >
                GradeMyProf is a student-driven platform designed to empower academic decisions through detailed professor reviews and real-time insights. By allowing users to scrape and chat about Rate My Professor pages, we provide a personalized experience that helps students find the best professor for their needs.
              </Typography>
              <SignedOut>
                <Button
                  variant='contained'
                  sx={{
                    // background: '#FF8FB1',
                    background: '#80489C',
                    '&:hover': {
                      backgroundColor: '#9A1750'
                    },
                    borderRadius: 10,

                  }}
                  href="/sign-in"
                  onClick={() => {
                    // window.location.href = '/find';
                    console.log('clicked');
                  }}
                >
                  Get Started
                </Button>
              </SignedOut>
              <SignedIn>
                <Button
                  variant='contained'
                  sx={{
                    // background: '#FF8FB1',
                    background: '#80489C',
                    '&:hover': {
                      backgroundColor: '#9A1750'
                    },
                    borderRadius: 10,

                  }}
                  href="/professor-insights"
                  onClick={() => {
                    // window.location.href = '/find';
                    console.log('clicked');
                  }}
                >
                  Get Started
                </Button>
              </SignedIn>
            </Stack>
            <Image 
              src='/3d-casual-life-group-of-young-people-discussing-something-while-working.png'
              width={600}
              height={600}
              alt="casual group of young people discussing something while working"
            />
          </Stack>
        </Box>
    </Box>
  );
}
