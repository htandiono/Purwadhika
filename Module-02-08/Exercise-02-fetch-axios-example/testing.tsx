import { useEffect, useRef, useState } from "react";
import axios from "axios";

type Post = {
    userId: number;
    id: number;
    title: string;
    body: string;
};

const BASE_URL = "https://jsonplaceholder.typicode.com";

async function fetchPosts() {
    const response = await fetch(`${BASE_URL}/posts`);
    const posts = await response.json();
    return posts as Post[];
}

async function fetchPostsWithAxios() {
    const response = await axios.get<Post[]>(`${BASE_URL}/posts`);
    return response.data;
}

function App() {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState<Post[]>([]);

    async function handleRefresh() {
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // const posts = await fetchPosts();
        const posts = await fetchPostsWithAxios();
        setPosts(posts);
        setLoading(false);
    }

    const timeoutRef = useRef<number>(null);
    const [counter, setCounter] = useState(0);
    useEffect(() => {
        if (timeoutRef.current) {
            clearInterval(timeoutRef.current);
        }
        timeoutRef.current = window.setInterval(() => {
            setCounter((prev) => prev + 1);
        }, 1_000);
        return () => {
            if (timeoutRef.current) {
                clearInterval(timeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (counter % 5 === 0) {
            void handleRefresh();
        }
    }, [counter]);

    return (
        <section>
            <h1>Counter</h1>
            <p>{counter}</p>
            <h1>Posts</h1>
            {loading && <p>Loading...</p>}
            {!loading &&
                posts.map((post) => (
                    <article key={post.id}>
                        <h2>{post.title}</h2>
                        <p>{post.body}</p>
                    </article>
                ))}
        </section>
    );
}

export default App;