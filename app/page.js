import { Typography, Box, Stack, Button, Container } from "@mui/material";
import Image from "next/image";
import Header from "./components/Header";
import { Lilita_One } from "next/font/google";

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
              <Button
                variant='contained'
                sx={{
                  // background: '#FF8FB1',
                  background: '#80489C',
                  '&:hover': {
                    backgroundColor: '#9A1750'
                  }
                }}
              >
                Get Started
              </Button>

            </Stack>
            <Image 
              src='/3d-casual-life-group-of-young-people-discussing-something-while-working.png'
              width={600}
              height={600}
            />
          </Stack>
        </Box>
    </Box>
  );
}
