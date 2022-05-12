import * as React from 'react';

const initialStories = [
  {
    title: 'React',
    url: 'https://reactjs.org/', 
    author: 'Jordan Walke', 
    num_comments: 3, 
    points: 4,
    objectID: 0,
  },
  {
    title: 'Redux',
    url: 'https://redux.js.org/',
    author: 'Dan Abramov, Andrew Clark', num_comments: 2,
    points: 5,
    objectID: 1,
  }
];

//使用缓存记录上一次在搜索框里留下的内容
//利用UseState来决定搜索框要呈现的值
//利用UseEffect来完成事件触发和更新
const useSemiPersistentState = (key,initialState) => {
  const[value,setValue] = React.useState(
    localStorage.getItem(key)|| initialState
  );

  React.useEffect(() => {
    localStorage.setItem(key,value);
  },[key, value]);

  return[value, setValue];
};

const App = () =>{ 
  
  const [searchTerm,setSearchTerm] = useSemiPersistentState('search','React');
  //useState有两个值，一个用来read，一个用来update
  const [stories, setStories] = React.useState(initialStories);

  //移除了一个item，不等于item.objectID的项目都会被保留
  const handleRemoveStory = item => {
    const newStories = stories.filter(
      story => item.objectID !== story.objectID
    );

    setStories(newStories);
  };

  const handleSearch = event =>{
    setSearchTerm(event.target.value);
  };



  const searchedStories = stories.filter(stroy =>
    stroy.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return ( 
  <div>
    <h1>My Hacker Stories</h1> 

    <InputWithLabel
      id="search"
      value={searchTerm}
      isFocused
      onInputChange={handleSearch}
    >
      <strong>Search:</strong>
    </InputWithLabel>

  <hr/>
  <List list={searchedStories} onRemoveItem={handleRemoveStory}/>
</div> 
);
};

//渲染查询框
const InputWithLabel = ({
  id, 
  value, 
  type = 'text', 
  onInputChange, 
  isFocused, 
  children,
}) => {
    const inputRef = React.useRef();
    
    React.useEffect(() => {
      if(isFocused){
        inputRef.current.focus();
      }
    },[isFocused]);

    return(
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        ref={inputRef}
        id={id} 
        type={type}  
        value={value}
        onChange={onInputChange}
      />
    </>
    );
  };
  

//渲染list
//遍历map中的每个item对象
const List = ({list, onRemoveItem}) =>
    list.map(item => (
      <Item 
        key={item.objectID}
        item={item}
        onRemoveItem={onRemoveItem}
      />
    ));
//渲染item
//渲染dismiss按钮
const Item = ({item, onRemoveItem}) => (
    <div>
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
      <span>
        <button type="button" onClick={() => onRemoveItem(item)}>
          Dismiss
        </button>
      </span>
    </div>
  );

export default App; 
