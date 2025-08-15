import {Box, LinearProgress} from "@mui/material";

export function LinearProgressWithLabel(props) {
    return (
        <Box sx={{display: 'flex', alignItems: 'center'}}>
            <Box sx={{width: '85%', mr: 1}}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{minWidth: 35}}>
                <p>
                    {`${Math.round(props.value)}%`}
                </p>
            </Box>
        </Box>
    );
}
