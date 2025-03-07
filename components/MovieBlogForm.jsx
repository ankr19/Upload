"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/firebase/FirebaseConfig";
import moment from "moment/moment";

const MovieBlogForm = () => {
  const [formData, setFormData] = useState({
    id: "",
    house: "",
    plot: "",
    title: "",
    releaseDate: "",
    keywords: "",
    genre: "",
    director: "",
    cast: [{ name: "", performance: "" }],
    synopsis: "",
    description: "",
    rating: "",
    mainImage: null,
    images: [],
    production: "",
    theme: "",
    legacy: "",
    firstImpression: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({
      ...formData,
      images: [...formData.images, ...e.target.files],
    });
  };

  const handleMainImageChange = (e) => {
    setFormData({ ...formData, mainImage: e.target.files[0] });
  };

  const handleCastChange = (index, field, value) => {
    const updatedCast = [...formData.cast];
    updatedCast[index][field] = value;
    setFormData({ ...formData, cast: updatedCast });
  };

  const addCastMember = () => {
    setFormData({
      ...formData,
      cast: [...formData.cast, { name: "", performance: "" }],
    });
  };
  const uploadImage = async (file) => {
    const storageRef = ref(storage, `movie-posters/${file.name}`);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let mainImageUrl = "";
      if (formData.mainImage) {
        mainImageUrl = await uploadImage(formData.mainImage);
      }

      const imageUrls = await Promise.all(
        formData.images.map(async (image) => await uploadImage(image))
      );

      await addDoc(collection(db, "movieBlogs"), {
        ...formData,
        mainImage: mainImageUrl,
        date: Number(moment().unix()),
        images: imageUrls,
      });
      alert("Movie blog post added successfully!");
      setFormData({
        id: "",
        house: "",
        plot: "",
        title: "",
        releaseDate: "",
        keywords: "",
        genre: "",
        director: "",
        cast: [{ name: "", performance: "" }],
        synopsis: "",
        description: "",
        rating: "",
        mainImage: null,
        images: [],
        production: "",
        theme: "",
        legacy: "",
        firstImpression: "",
      });
    } catch (error) {
      console.error("Error adding movie blog:", error);
      alert("Failed to add movie blog.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-4">Add a Movie Blog Post</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label className="mb-2">Movie Id</Label>
              <Input
                type="text"
                name="id"
                value={formData.id}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Movie Title</Label>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Movie Keywords</Label>
              <Input
                type="text"
                name="keywords"
                value={formData.keywords}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Movie Description</Label>
              <Input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Movie Production House</Label>
              <Input
                type="text"
                name="house"
                value={formData.house}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Release Date</Label>
              <Input
                type="date"
                name="releaseDate"
                value={formData.releaseDate}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Genre</Label>
              <Select
                onValueChange={(value) =>
                  setFormData({ ...formData, genre: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Action">Action</SelectItem>
                  <SelectItem value="Drama">Drama</SelectItem>
                  <SelectItem value="Comedy">Comedy</SelectItem>
                  <SelectItem value="Horror">Horror</SelectItem>
                  <SelectItem value="Sci-Fi">Sci-Fi</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Production and Director</Label>
              <Textarea
                name="director"
                value={formData.director}
                onChange={handleChange}
                required
              />
            </div>
            {/* <div>
              <Label className="mb-2">Production</Label>
              <Textarea name="production" value={formData.production} onChange={handleChange} required />
            </div> */}
            <div>
              <Label className="mb-2">Theme</Label>
              <Textarea
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Legacy</Label>
              <Textarea
                name="legacy"
                value={formData.legacy}
                onChange={handleChange}
              />
            </div>
            <div>
              <Label className="mb-2">First Impression</Label>
              <Textarea
                name="firstImpression"
                value={formData.firstImpression}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Cast & Performance</Label>
              {formData.cast.map((member, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <Input
                    type="text"
                    placeholder="Actor Name"
                    value={member.name}
                    onChange={(e) =>
                      handleCastChange(index, "name", e.target.value)
                    }
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Performance"
                    value={member.performance}
                    onChange={(e) =>
                      handleCastChange(index, "performance", e.target.value)
                    }
                    required
                  />
                </div>
              ))}
              <Button type="button" onClick={addCastMember} className="mt-2">
                Add More Cast
              </Button>
            </div>
            <div>
              <Label className="mb-2">Synopsis</Label>
              <Textarea
                name="synopsis"
                value={formData.synopsis}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Plot</Label>
              <Textarea
                name="plot"
                value={formData.plot}
                onChange={handleChange}
                required
                className="h-32"
              />
            </div>
            <div>
              <Label className="mb-2">Rating</Label>
              <Input
                type="number"
                name="rating"
                value={formData.rating}
                onChange={handleChange}
                required
                min="1"
                max="10"
                step="0.1"
              />
            </div>
            <div>
              <Label className="mb-2">Main Poster Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleMainImageChange}
                required
              />
            </div>
            <div>
              <Label className="mb-2">Upload Additional Images</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default MovieBlogForm;
