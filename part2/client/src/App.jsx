
import { useState, useEffect } from "react"
import Note from "./components/Note"
import axios from "axios"
import noteService from './services/notes'
import Notification from "./components/Notification"

const Footer = () => {
  const footerStyle = {
    color: 'green',
    fontStyle: 'italic',
    fontSize: 16
  }
  return (
    <div style={footerStyle}>
      <br />
      <em>Note app, Department of Computer Science, University of Helsinki 2023</em>
    </div>
  )
}

const App = (props) => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("a new note...")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState("Some error happened!")

  useEffect(() => {
    noteService
      .getAll()
      .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  const toggleImportanceOf = id => {
    // const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // axios.put(url, changedNote)
    //   .then(response => {
    //     setNotes(notes.map(n => n.id !== id ? n : response.data))
    //   })

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(`Note ${note.content} was already removed from server`)
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        // alert(`the note "${note.content}" was already deleted from server`)
        setNotes(notes.filter(n => n.id !== id))
      })
    console.log(`importance of ${id} needs to be toggled`)
  }

  // const hook = () => {
  //   console.log("effect");

  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log("promise fulfilled");
  //       setNotes(response.data)
  //     })
  // }



  console.log("render", notes.length, "notes");




  const addNote = (event) => {
    event.preventDefault()
    console.log("Button Clicked", event.target);
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
      // id: notes.length + 1
    }

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote("")
      })

    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    //   .then(response => {
    //     setNotes(notes.concat(response.data))
    //     setNewNote("")
    //   })

  }

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value)
  }

  const notesToShow = showAll ? notes : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note =>
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input type="text" value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />
    </div>
  )
}



export default App