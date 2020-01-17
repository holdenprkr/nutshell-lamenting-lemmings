// Authored by: Holden Parker
import { saveEvent, getEvents, useEvents, editEvent } from "./EventDataProvider.js"

const eventHub = document.querySelector(".container")
const contentTarget = document.querySelector(".addEventButton")

export const AddEventForm = () => {

    eventHub.addEventListener("click", e => {
        if (e.target.id === "saveEventButton") {
        const hiddenInputValue = document.querySelector("#event-id").value
        
        if (hiddenInputValue !== "") {
        const editedEvent = {
            userId: parseInt(sessionStorage.getItem("activeUser"), 10),
            name: document.querySelector("#eventNameText").value,
            location: document.querySelector("#eventLocationText").value,
            timestamp: document.querySelector("#eventDate").value,
            id: parseInt(document.querySelector("#event-id").value, 10)
        }

        editEvent(editedEvent).then(() => {
          eventHub.dispatchEvent(new CustomEvent("eventHasBeenEdited"))
        })

        const resetEventForm = () => {
            document.querySelector("#eventNameText").value = ""
            document.querySelector("#eventLocationText").value = ""
            document.querySelector("#eventDate").value = ""
        }
        resetEventForm()

        document.querySelector("#event-id").value = ""
      } else {
        const newEvent = {
            userId: parseInt(sessionStorage.getItem("activeUser"), 10),
            name: document.querySelector("#eventNameText").value,
            location: document.querySelector("#eventLocationText").value,
            timestamp: document.querySelector("#eventDate").value,
        }
        saveEvent(newEvent).then(getEvents).then(() => {
            const message = new CustomEvent("newEventSaved")
            eventHub.dispatchEvent(message)
        })
        const resetEventForm = () => {
            document.querySelector("#eventNameText").value = ""
            document.querySelector("#eventLocationText").value = ""
            document.querySelector("#eventDate").value = ""
        }
        resetEventForm()
    }
    }})

    eventHub.addEventListener("click", e => {
    if (e.target.id.startsWith("editEvent--")) {
      const [prefix, id] = e.target.id.split("--")

      const allEvents = useEvents()
   
      const theFoundEvent = allEvents.find(
        (eventObj) => {
          return eventObj.id === parseInt(id, 10)
        }
      )
  
      document.getElementById("event-id").value = theFoundEvent.id
      document.getElementById("eventNameText").value = theFoundEvent.name
      document.getElementById("eventLocationText").value = theFoundEvent.location

      const message = new CustomEvent("editEventButtonClicked")
      eventHub.dispatchEvent(message)
    }})


    const render = () => {
    contentTarget.innerHTML =   
      `<div class="addEvent">
          <button id="button--addEvent">Add Event</button>

          <dialog class="dialog--addEvent">
            <label class="dialogTitles">Add a New Event!</label>
            <button class="button--close">X</button>
            <hr>
              <div>
                <input type="hidden" id="event-id" />
                <label for="eventNameText">Name of Event:</label>
                <input id="eventNameText" type="text" />
                <br>
                <label for="eventLocationText">Event Location:</label>
                <input id="eventLocationText" type="text" />
                <br>
                <label for="eventDate">Event Date and Time:</label>
                <input type="datetime-local" id="eventDate">
                <br>
              </div>
              <button class="button--save button--close" id="saveEventButton">Save</button>         
          </dialog>
      </div>`
    }
    render()
}