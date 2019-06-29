const React = require("react");
const { Link } = require("react-router-dom");
const PostList = require("./PostList");
const PageHeader = require("./PageHeader");
const ErrorPage = require("./ErrorPage");
const TagSearchForm = require("./TagSearchForm");
const { blog_name, posts_per_page } = require("./config");
const { getPosts } = require("./api");

// props:
//   home_posts
//   updateHomePosts(home_posts)
//   session
class IndexPage extends React.Component {
  constructor(props) {
    super(props);
    this.getPosts = this.getPosts.bind(this);
  }
  
  getPosts(page) {
    const home_posts = this.props.home_posts;
    const updateHomePosts = this.props.updateHomePosts;

    getPosts(page, posts_per_page).then((res) => {
      home_posts[page] = res.posts;
      updateHomePosts(home_posts);
    });
  }

  render() {
    const home_posts = this.props.home_posts;
    const getPosts = this.getPosts;
    const session = this.props.session;
    const params = this.props.match.params;
    const page = params.page ? parseInt(params.page) : 0;
    const logged_in = session.loggedIn();

    if (Number.isNaN(page)) {
      return <ErrorPage session={session} />;
    }

    document.title = blog_name;

    if (!home_posts[page]) {
      getPosts(page);
    }
    
    const posts = home_posts[page] || [];
    const has_next_page = posts.length === posts_per_page ? true : false;
    const next_page_link = has_next_page ?
          <Link to={`/${page+1}`} className="foot_link">Next Page</Link> :
          undefined;
    const prev_page_link = page > 0 ?
          <Link to={`/${page-1}`} className="foot_link">Prev Page</Link> : 
          undefined;
    const post_start = page * posts_per_page + 1;
    const post_end = post_start + posts.length - 1;
    const header = posts.length > 0 
                   ? `Showing posts ${post_start} to ${post_end}`
                   : "No posts to show";

    return (
      <div>
        <PageHeader session={session}/>
        <TagSearchForm />
        <h3>{header}</h3>
        <PostList posts={posts}/>
        {prev_page_link}
        {next_page_link}
      </div>
    );
  }
}

module.exports = IndexPage;
