import axios from "axios";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../config";

export interface Blog {
    "content": string,
    "title": string,
    "id": string,
    "author": {
        "name": string
    },
    "publishDate": string // Add publishDate to Blog type
}

export const useBlog = ( { id } : { id:string}) => {
    
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>(); 

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/${id}`, {
            headers: {
                Authorization: localStorage.getItem("token") || '' // Added fallback value for getItem
            }
        })
        .then(response => {
            setBlog(response.data); 
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching blogs:", error); 
            setLoading(false); 
        });

    }, [id]);

    return {
        loading,
        blog
    };
};


export const useBlogs = () => {
    
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState<Blog[]>([]); 

    useEffect(() => {
        axios.get(`${BACKEND_URL}/api/v1/blog/bulk`, {
            headers: {
                Authorization: localStorage.getItem("token") || '' // Added fallback value for getItem
            }
        })
        .then(response => {
            setBlogs(response.data.post); 
            setLoading(false);
        })
        .catch(error => {
            console.error("Error fetching blogs:", error); 
            setLoading(false); 
        });

    }, []);

    return {
        loading,
        blogs
    };
};
