import React, { useEffect, useState } from "react"
import { Box, CircularProgress, Grid, IconButton, Paper } from "@mui/material"
import { Nagazap } from "../../../types/server/class/Nagazap"
import { Subroute } from "../Subroute"
import { DeleteForever, Refresh } from "@mui/icons-material"
import { api } from "../../../api"

interface BlacklistProps {
    nagazap?: Nagazap
    setNagazap: React.Dispatch<React.SetStateAction<Nagazap>>
}

export const Blacklist: React.FC<BlacklistProps> = ({ nagazap, setNagazap }) => {

    const [loading, setLoading] = useState(false)
    const [blacklist, setBlacklist] = useState<string[]>([])

    const handleDelete = async (number: string) => {
        try {
            const response = await api.delete("/whatsapp/blacklist", { data: { number } })
            setNagazap(response.data)
        } catch (error) {
            console.log(error)
        }
    }

    const refresh = async () => {
        setLoading(true)
        try {
            const response = await api.get("/whatsapp")
            setNagazap(response.data)
            console.log(response.data)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSearch = (value: string) => {
        if (!nagazap) return
        setBlacklist(nagazap?.blacklist.filter((phone) => phone.includes(value)))
    }


    useEffect(() => {
        if (nagazap) {
            setBlacklist(nagazap.blacklist)
        }
    }, [nagazap?.blacklist])

    return (
        <Subroute
            title="Lista negra"
            right={
                <IconButton onClick={refresh} disabled={loading}>
                    {loading ? <CircularProgress size="1.5rem" color="secondary" /> : <Refresh />}
                </IconButton>
            }
        >
            <Grid container columns={6} spacing={2}>
                {blacklist.map((number, index) => (
                    <Grid item xs={1} key={index}>
                        <Paper sx={{ padding: "0.5vw", alignItems: "center", justifyContent: "space-between" }}>
                            <Box>{number}</Box>
                            <IconButton onClick={() => handleDelete(number)}>
                                <DeleteForever />
                            </IconButton>
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Subroute>
    )
}
