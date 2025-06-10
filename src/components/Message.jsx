function Message({ title, username, content, date }) {
  return (
    <div>
      <div className='elevated-card flex-c w-90 gap-10'>
        <div className="flex-r align-c gap-10">
          <h3>{title}</h3>
          <p>by {username}</p>
        </div>
        <p>{content}</p>
      </div>
      <p><span className='msg-date'>{date}</span></p>
    </div>
  );
}

export default Message;
