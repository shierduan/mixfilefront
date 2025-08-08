import {Link} from "@mui/material";
import {getParamUrl, updateURLParams} from "../../utils/CommonUtils.js";

function ParamLink({params, children}) {
    return (
        <Link
            underline="hover"
            color="inherit"
            href={getParamUrl(params)}
            onClick={(e) => {
                e.preventDefault();
                updateURLParams(params)
            }}>
            {children}
        </Link>
    );
}

export default ParamLink;