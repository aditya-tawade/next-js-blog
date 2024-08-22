import axios from "axios";
import { useRouter } from "next/router";

export async function getStaticPaths() {
  // Fetch the list of blog posts from Strapi
  const res = await axios.get("https://strapi.adityatawade.com/api/test-blogs");
  const blogs = res.data.data;

  // Generate paths based on blog IDs
  const paths = blogs.map((blog) => ({
    params: { id: blog.id.toString() },
  }));

  return {
    paths,
    fallback: false, // or 'blocking' if you want to generate pages on-demand
  };
}

export async function getStaticProps({ params }) {
  // Fetch a single blog post based on the ID
  const res = await axios.get(
    `https://strapi.adityatawade.com/api/test-blogs/${params.id}`
  );
  const blog = res.data.data;

  return {
    props: {
      blog,
    },
  };
}

const BlogPost = ({ blog }) => {
  const { attributes } = blog;
  const { Text, Rich } = attributes;

  // Convert the Rich content to HTML elements
  const renderRichText = (rich) => {
    return rich.map((element, index) => {
      if (element.type === "heading") {
        return (
          <h3
            key={index}
            style={{ fontWeight: element.children[0].bold ? "bold" : "normal" }}
          >
            {element.children[0].text}
          </h3>
        );
      }
      if (element.type === "paragraph") {
        return <p key={index}>{element.children[0].text}</p>;
      }
      return null;
    });
  };

  return (
    <div>
      <h1>{Text}</h1>
      {renderRichText(Rich)}
    </div>
  );
};

export default BlogPost;
