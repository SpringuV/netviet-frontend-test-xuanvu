/* eslint-disable @next/next/no-img-element */
'use client'
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import Alert from "./alert/alert";
import { AlertStatus } from "@/types/type";

const categories = [
    { id: "1", name: "Nature" },
    { id: "2", name: "Architecture" },
    { id: "3", name: "Travel" },
    { id: "4", name: "Objects" },
    { id: "5", name: "People" },
    { id: "6", name: "Vehicles" },
    { id: "7", name: "Art" },
    { id: "8", name: "Animals" },
];
const CreateNewCart = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const [alert, setAlert] = useState<{ title: string; message: string; type: AlertStatus; duration: number } | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newItemGallery, setNewItemGallery] = useState({
        title: '',
        category: '',
        image: '',
        tags: '',
        description: '',
        author: '',
        created_at: new Date().toISOString(),
        like: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItemGallery({ ...newItemGallery, [name]: value });
        // update preview if image field is changed
        if (name === 'image') setPreview(value);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemGallery.title || !newItemGallery.category || !newItemGallery.image || !newItemGallery.author) {
            setAlert({ title: "Error", message: "Please fill in all required fields", type: "error", duration: 3000 });
            return;
        }
        try {
            const res = await fetch('http://localhost:3001/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItemGallery),
            });
            const data = await res.json();
            if (!data || !data.id) {
                setAlert({
                    title: "Error",
                    message: "Invalid response from server",
                    type: "error",
                    duration: 3000
                });
                return;
            }
            setAlert({ title: "Success", message: "Item created", type: "success", duration: 3000 });
            // reset form
            setPreview(null);
            setNewItemGallery({
                title: '',
                category: '',
                image: '',
                tags: '',
                description: '',
                author: '',
                created_at: new Date().toISOString(),
                like: 0,
            });
            setSelectedCategory(null);
        } catch (err) {
            console.error(err);
            setAlert({ title: "Error", message: "Error creating Item", type: "error", duration: 3000 });
        }
    }

    return (
        <>
            {alert && (
                <div className="absolute top-15 right-10 z-50">
                    <Alert
                        title={alert.title}
                        message={alert.message}
                        type={alert.type}
                        duration={3000}
                        onClose={() => setAlert(null)}
                    />
                </div>
            )}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-semibold my-6">Create New Item Gallery</h1>
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md bg-white py-3 px-6 rounded-xl shadow-md">
                    <div className="flex flex-col">
                        <label htmlFor="title" className="mb-2 font-medium">Title: </label>
                        <Input value={newItemGallery.title} onChange={handleInputChange} name="title" type="text" placeholder="Enter title ..." />
                    </div>
                    <div className="flex items-center gap-4">
                        <label htmlFor="category" className="font-medium">Category: </label>
                        <Select key={selectedCategory ?? 'empty'} value={selectedCategory || undefined} onValueChange={(value) => {
                            setNewItemGallery(prev => ({ ...prev, category: value }));
                            setSelectedCategory(value);
                        }}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent className="z-[1004]">
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.name}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="image" className="mb-2 font-medium">Image URL: </label>
                        <Input value={newItemGallery.image} onChange={handleInputChange} name="image" type="text" placeholder="Enter image URL ..." />
                        {preview && (
                            <div className="m-auto">
                                <img src={preview} alt="Preview image" className="w-52 h-52 object-cover rounded-lg mt-2" />
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="author" className="mb-2 font-medium">Author: </label>
                        <Input value={newItemGallery.author} onChange={handleInputChange} name="author" type="text" placeholder="Enter author ..." />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="tags" className="mb-2 font-medium">Tags: </label>
                        <Input value={newItemGallery.tags} onChange={handleInputChange} name="tags" type="text" placeholder="Enter tags ..." />
                    </div>
                    <div className="flex flex-col">
                        <label htmlFor="description" className="mb-2 font-medium">Description: </label>
                        <Textarea value={newItemGallery.description} onChange={handleInputChange} name="description" placeholder="Enter description ..." />
                    </div>
                    <div className="flex justify-end">
                        <button type="submit" className=" text-white py-2 px-5 rounded-lg duration-300 transition-colors bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">Create</button>
                    </div>
                </form>
            </div>
        </>
    )
}

export default CreateNewCart;