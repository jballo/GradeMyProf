import Header from "../components/Header";
import React from 'react';
import { Box, Button, Grid, Typography, Card, CardMedia, CardContent } from '@mui/material';
import { Lilita_One } from "next/font/google";

const lilita_one = Lilita_One({
    weight: '400',
    style: 'normal',
    subsets: ['latin']
})

const teamMembers = [
  {
    name: 'Jonathan Ballona Sanchez',
    title: 'Full Stack Software Engineer and Project Manager',
    description: 'Graduate of UC Merced',
    website: 'https://jonathanballonasanchez.com/',
    imgUrl: "https://media.licdn.com/dms/image/v2/D5603AQH075CKMqquGQ/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1707858516664?e=1729728000&v=beta&t=pCTfvE-Aj-CD0BKnH0hdSOO6CVGz0yLwgfWRenwA7hA",
  },
  {
    name: 'Karla Zamora',
    title: 'AI/ML and Backend Developer',
    description: 'University of Texas, Rio Grande Valley',
    website: 'https://karla-zamora.com/',
    imgUrl: 'https://media.licdn.com/dms/image/v2/D5603AQFlLt2GhSDanw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1720386285605?e=1729728000&v=beta&t=vnd8n2GkMD2X3mHc7fUQ2vcmfJT4BH3jphfSN0rXOpc',
  },
  {
    name: 'Pranav Palle',
    title: 'UI/UX Designer and Frontend Developer',
    description: 'University of Maryland, College Park',
    website: 'https://pranavpalle.netlify.app',
    imgUrl: 'https://media.licdn.com/dms/image/v2/D5603AQEeBxxRkZL8Uw/profile-displayphoto-shrink_800_800/profile-displayphoto-shrink_800_800/0/1695523201341?e=1729728000&v=beta&t=6dL2Hpz-LRMAyeOr9q82Q5t3p7cN8io4m8_ttSGBJlw',
  },
];

const ContactPage = () => {
  return (
    <Box
        width="100vw"
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
            <Typography 
                variant="h1" 
                gutterBottom
                sx={{
                    fontSize: '5rem',
                    fontFamily: lilita_one.style.fontFamily,
                }}
                >
                Meet The Team
                </Typography>
            <Grid container spacing={4} >
                {teamMembers.map((member, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card sx={{ boxShadow: 3, textAlign: 'center' }}>
                            <CardMedia
                                component="img"
                                alt={member.name}
                                image={member.imgUrl} 
                                sx={{ borderRadius: '4px 4px 0 0' }}
                            />
                            <CardContent>
                                <Typography variant="h5">{member.name}</Typography>
                                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                                    {member.title}
                                </Typography>
                                <Typography variant="body2">{member.description}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ mt: 2 }}
                                    href={member.website}
                                    target="_blank"
                                >
                                    Personal Website
                                </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    </Box>
  );
};

export default ContactPage;