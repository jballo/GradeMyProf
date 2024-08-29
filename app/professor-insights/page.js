'use client';

import { useEffect, useState } from "react";
import { Box, Button, Grid, Stack, TextField, Typography, Card, CardContent, Divider, CircularProgress, Rating } from "@mui/material";
import { Lilita_One } from "next/font/google";
import Header from "../components/Header";
import Chat from "../components/Chat";

const lilita_one = Lilita_One({
    weight: '400',
    style: 'normal',
    subsets: ['latin']
})

export default function Page() {
    const [url, setUrl] = useState('');
    const [professorData, setProfessorData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleUrlChange = (e) => {
        setUrl(e.target.value);
    };

    const processProfessorInfo = (data) => {
        fetch('/api/process_prof_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(res => res.json())
            .then(data => {
                console.log('Success');
                console.log(data);
            })
            .catch(err => {
                console.log('Error: ', err);
            });
    };

    const submitUrl = () => {
        setLoading(true);
        fetch('/api/retrieve_prof_data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                professorUrl: url
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log('Success');
                console.log('Returned Professor Data: ', data);
                setProfessorData(data);
                setLoading(false);
            })
            .catch(err => {
                console.log('Error: ', err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (professorData !== null) {
            processProfessorInfo(professorData);
        }
    }, [professorData]);

    return (
        <Box
            width="100vw"
            height="100vh"
            bgcolor="#FCE2DB"
            p={4}
        >
            <Header />
            <Stack
                direction="column"
                justifyContent="center"
                alignItems="center"
                mb={4}
            >
                <Stack
                    direction="row"
                    justifyContent="center"
                    alignItems="center"
                    spacing={2}
                    sx={{
                        width: '100%',
                        maxWidth: '600px',
                        bgcolor: '#906aa3',
                        borderRadius: 2,
                        padding: '1rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <TextField
                        label="Enter URL Here..."
                        variant="standard"
                        size="small"
                        fullWidth
                        sx={{
                            bgcolor: '#fce2db',
                            borderRadius: 2,
                            '& .MuiInputBase-root': {
                                color: '#906aa3',
                            },
                            '& .MuiInputLabel-root': {
                                color: '#906aa3',
                                pl: 1
                            },
                            pl: 1
                        }}
                        value={url}
                        onChange={handleUrlChange}
                    />
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            bgcolor: '#D8BFD8',
                            color: '#906aa3',
                            '&:hover': {
                                bgcolor: '#b19cd9'
                            },
                            height: '40px'
                        }}
                        onClick={submitUrl}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} sx={{ color: '#906aa3' }} /> : 'Submit'}
                    </Button>
                </Stack>
            </Stack>
            <Grid container spacing={4}>
                <Grid item sm={12} md={6} lg={6}>
                    <Typography variant="h4" mb={2}
                        sx={{
                            fontFamily: lilita_one.style.fontFamily,
                            fontSize: '2rem',
                        }}
                    >
                        Professor Data
                    </Typography>
                    {professorData && (
                        <Box
                            sx={{
                                maxHeight: '60vh',
                                overflow: 'auto',
                                pr: 2,
                                scrollbarWidth: 'none',
                                msOverflowStyle: 'none',
                                '&::-webkit-scrollbar': {
                                    width: 0,
                                    height: 0,
                                },
                            }}
                        >
                            <Typography variant="h5" gutterBottom>
                                {professorData.firstName} (Rating: {professorData.rating})
                                <Rating
                                    value={professorData.rating}
                                    precision={0.1}
                                    readOnly
                                    sx={{
                                        verticalAlign: 'middle',
                                        ml: 1
                                    }}
                                />
                            </Typography>
                            <Grid container spacing={2}>
                                {professorData.reviews.map((review, index) => (
                                    <Grid item xs={12} key={index}>
                                        <Card
                                            sx={{
                                                backgroundColor: '#906aa3',
                                                borderRadius: 2,
                                                border: '1px solid #D8BFD8',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                            }}
                                        >
                                            <CardContent
                                                sx={{
                                                    border: '1px solid #D8BFD8',
                                                    borderRadius: 1,
                                                    padding: 2,
                                                }}
                                            >
                                                <Typography variant="h6" gutterBottom color="white">
                                                    {review.className}
                                                </Typography>
                                                <Typography variant="body2" color="#fce2db">
                                                    Date: {review.date}
                                                </Typography>
                                                <Typography variant="body2" color="#fce2db">
                                                    Quality: {review.quality} | Difficulty: {review.difficulty}
                                                    <Rating
                                                        value={review.quality}
                                                        precision={0.1}
                                                        readOnly
                                                        sx={{
                                                            verticalAlign: 'middle',
                                                            ml: 1
                                                        }}
                                                    />
                                                </Typography>
                                                <Divider sx={{ my: 2, backgroundColor: '#fce2db' }} />
                                                <Typography variant="body2" color="white">
                                                    {review.comment}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </Grid>
                <Grid item sm={12} md={6} lg={6}>
                    <Typography variant="h4" mb={2}
                        sx={{
                            fontFamily: lilita_one.style.fontFamily,
                            fontSize: '2rem',
                        }}
                    >
                        Professor Recommendation
                    </Typography>
                    <Typography variant="h5" gutterBottom>
                        Compare professors with our AI chatbot!
                    </Typography>
                    <Chat professorData={professorData} />
                </Grid>
            </Grid>
        </Box>
    );
}
