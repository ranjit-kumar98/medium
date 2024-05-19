import { BlogCard } from "../components/BlogCard";
import { Appbar } from "../components/AppBar";
import { useBlogs } from "../hooks";
import { Loading } from "../components/Loading";

// Define BlogType interface outside the component function
interface BlogType {
    author: {
        name: string
    },
    title: string,
    content: string,
    publishDate: string,
    id: string
}

export const Blogs = () => {

    const { loading, blogs} = useBlogs();

    if(loading)
    {
        return <div>
            <Loading />
        </div>
    }

    return (
        <div className="flex flex-col items-center"> 
            <div className="w-full"> 
                <Appbar />
            </div>
            <div className="pt-4"> 
                {
                    blogs.map((blog: BlogType) => (
                        <BlogCard
                            id={blog.id} 
                            authorName={blog.author.name || "Anonymous"} 
                            title={blog.title}
                            content={blog.content}
                            publishDate="2nd-Feb-24"
                        />
                    ))
                }
            </div>
        </div>
    );
    ;
};

