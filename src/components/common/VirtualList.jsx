import {AutoSizer, List} from "react-virtualized";

function VirtualList(props) {

    return (
        <AutoSizer>
            {({width, height}) => (
                <List
                    width={width}
                    height={height}
                    {...props}/>
            )}
        </AutoSizer>
    );
}

export default VirtualList;