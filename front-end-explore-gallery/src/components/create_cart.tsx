/* eslint-disable @next/next/no-img-element */
'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "./ui/input";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useCategory } from "@/hooks/useHookItem";
import Alert from "./alert/alert";

const CreateNewCart = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const { data: categories, isLoading, isError } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [newItemGallery, setNewItemGallery] = useState({
        title: '',
        category: '',
        image: '',
        tags: '',
        description: '',
        author: '',
    });
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Tạo URL tạm thời để preview và gửi lên JSON Server
        const tempUrl = URL.createObjectURL(file);
        setPreview(tempUrl);
        setNewItemGallery(prev => ({ ...prev, image: tempUrl }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNewItemGallery({ ...newItemGallery, [name]: value });
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemGallery.title || !newItemGallery.category || !newItemGallery.image || !newItemGallery.author) {
            alert("Please fill in all required fields.");
            return;
        }
        try {
            const res = await fetch('http://localhost:3001/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItemGallery),
            });
            const data = await res.json();
            console.log('Created:', data);
            alert('Item created!');
            if (data.id) {
                <Alert title="Success" message="Item created" type="success" />
            }
            // reset form
            setPreview(null);
            setNewItemGallery({
                title: '',
                category: '',
                image: '',
                tags: '',
                description: '',
                author: '',
            });
        } catch (err) {
            console.error(err);
            <Alert title="Error" message="Error create Item" type="error" />
        }
    }

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold mb-6">Create New Item Gallery</h1>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full max-w-md bg-white py-3 px-6 rounded-xl shadow-md">
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 font-medium">Title: </label>
                    <Input onChange={handleInputChange} name="title" type="text" placeholder="Enter title ..." />
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="category" className="font-medium">Category: </label>
                    {isLoading ? (
                        <div>Loading categories...</div>
                    ) : isError ? (
                        <div>Error loading categories</div>
                    ) : (
                        <Select value={selectedCategory || undefined} onValueChange={(value) => {
                            setNewItemGallery(prev => ({ ...prev, category: value }));
                            setSelectedCategory(value);
                        }}>
                            <SelectTrigger className="w-[200px]">
                                <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories?.map((cate: { id: number; name: string }) => (
                                    <SelectItem key={cate.id} value={cate.name}>
                                        {cate.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="flex flex-col">
                    <label htmlFor="image" className="mb-2 font-medium">Image: </label>
                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-blue-500 transition">
                        {preview ? (
                            <img src={preview} alt="Preview image" className="w-52 h-52 object-cover rounded-lg" />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCloudArrowUp} className="text-4xl text-gray-500 mb-2" />
                                <span className="text-gray-500">Click to upload</span>
                            </>
                        )}
                        <Input id="image" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="image" className="absolute inset-0 cursor-pointer"></label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="author" className="mb-2 font-medium">Author: </label>
                    <Input onChange={handleInputChange} name="author" type="text" placeholder="Enter author ..." />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="tags" className="mb-2 font-medium">Tags: </label>
                    <Input onChange={handleInputChange} name="tags" type="text" placeholder="Enter tags ..." />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="mb-2 font-medium">Description: </label>
                    <Textarea onChange={handleInputChange} name="description" placeholder="Enter description ..." />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className=" text-white py-2 px-5 rounded-lg duration-300 transition-colors bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewCart;