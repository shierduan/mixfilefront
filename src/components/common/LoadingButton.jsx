import {useState} from 'react';
import {Button, CircularProgress} from "@mui/material";

function LoadingButton(props) {

    const {onClick, disabled, children} = props

    const [loading, setLoading] = useState(false);

    return (
        <Button
            {...props}
            disabled={loading || disabled}
            children={
                loading ? <CircularProgress size={30}/> : children
            }
            onClick={async () => {
                setLoading(true);
                try {
                    await onClick?.();
                } catch (error) {
                    console.error("Error in LoadingButton:", error);
                } finally {
                    setLoading(false);
                }
            }}/>
    );
}

export default LoadingButton;