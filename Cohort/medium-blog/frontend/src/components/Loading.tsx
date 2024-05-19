import { Loader } from "./Loader"

export const Loading = () => {
    return <div className="flex flex-col px-24 pt-4">
        <div> <Loader /> </div>
        <div> <Loader /> </div>
        <div> <Loader /> </div>

    </div>
}