import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    title: "",
    department: "",
    password: "",
    photograph: null,
    courseIds: [], // Array to store selected course IDs
  });

  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [selectedCourses, setSelectedCourses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch available courses
    axios
      .get("http://localhost:8080/api/courses")
      .then((response) => {
        setCourses(response.data); // Set the course data
      })
      .catch((error) => console.error("Error fetching courses:", error));
  }, []);


  const handleCourseChange = (e) => {
    const selectedCourseId = e.target.value;
    const selectedCourse = courses.find(course => course.course.courseId === parseInt(selectedCourseId));

    if (!selectedCourse) return;

    // Check for conflicts: Same day and time for any selected course
    const conflict = selectedCourses.some(
      (course) => 
        course.day === selectedCourse.day && 
        course.time === selectedCourse.time
    );

    if (conflict) {
      setError("Schedule conflict: Another course is scheduled at the same time and day.");
    } else {
      setError("");
      // Add the selected course to the list of selected courses
      setSelectedCourses((prevCourses) => [...prevCourses, selectedCourse]);
      // Update formData to store course IDs
      setFormData((prevData) => ({
        ...prevData,
        courseIds: [...prevData.courseIds, selectedCourse.course.courseId],
      }));
    }
  };

  const handleCourseRemove = (courseId) => {
    // Remove the course from selected courses list
    const updatedSelectedCourses = selectedCourses.filter(course => course.course.courseId !== courseId);
    setSelectedCourses(updatedSelectedCourses);

    // Also remove courseId from formData
    setFormData((prevData) => ({
      ...prevData,
      courseIds: prevData.courseIds.filter(id => id !== courseId),
    }));
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
  
    // If the field is for file input, handle file differently
    if (name === 'photograph' && files.length > 0) {
      setFormData({
        ...formData,
        photograph: files[0],  // Storing the file object
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  // Update form data when submitting the form
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || formData.courseIds.length === 0 || !formData.department || !formData.title) {
      alert("Please fill all the fields.");
      return;
    }
  
    const formDataToSend = new FormData();
    
    // Loop through the formData and append each value (for files, append the actual file object)
    Object.keys(formData).forEach((key) => {
      if (key === "photograph") {
        if (formData.photograph) {
          formDataToSend.append(key, formData.photograph);  // Appending the file object here
        }
      } else {
        formDataToSend.append(key, formData[key]);
      }
    });
  
    // Append selected courses to form data
    selectedCourses.forEach((course, index) => {
      formDataToSend.append(`courses[${index}].courseId`, course.course.courseId);
      formDataToSend.append(`courses[${index}].courseCode`, course.course.courseCode);
      formDataToSend.append(`courses[${index}].name`, course.course.name);
      formDataToSend.append(`courses[${index}].day`, course.day);
      formDataToSend.append(`courses[${index}].time`, course.time);
    });
  
    try {
      const response = await axios.post("http://localhost:8080/faculty/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",  // This tells Spring that it's a multipart form
        },
      });
      alert("Registration successful");
      console.log("Registration successful:", response.data);
      navigate('/');
    } catch (error) {
      console.error("Error during registration:", error);
      alert("Registration failed");
    }
  };

  return (
    <div className="container mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Faculty Registration</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        
        {/* First Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Last Name */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

       {/* Department */}
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="department">
    Department
  </label>
  <input
    type="text"
    id="department"
    name="department"
    value={formData.department}
    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    required
  />
 
</div>

{/* Title */}
<div className="mb-4">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
    Title
  </label>
  <input
    type="text"
    id="title"
    name="title"
    value={formData.title}
    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    required
  />

</div>
        

        {/* Photograph upload */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photograph">
            Upload Photograph
          </label>
          <input
            type="file"
            id="photograph"
            name="photograph"
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Select Course */}
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Course</label>
          <select
            name="courseId"
            value=""
            onChange={handleCourseChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="">Select a course</option>
            {courses && courses.length > 0 ? (
              courses.map((course) => (
                <option key={course.course.courseId} value={course.course.courseId}>
                  {course.course.name} ({course.course.courseCode})
                </option>
              ))
            ) : (
              <option>No courses available</option>
            )}
          </select>
        </div>

        {/* Display Selected Courses */}
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Selected Courses</h2>
          {selectedCourses.length > 0 ? (
            <ul className="list-disc pl-5 mt-2">
              {selectedCourses.map((course) => (
                <li key={course.course.courseId} className="flex justify-between">
                  <span>{course.course.name} ({course.course.courseCode})</span>
                  <button
                    type="button"
                    onClick={() => handleCourseRemove(course.course.courseId)}
                    className="text-red-500"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p>No courses selected yet</p>
          )}
        </div>

        {/* Error message */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default Signup;
