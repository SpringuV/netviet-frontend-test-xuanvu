/* eslint-disable @next/next/no-img-element */
'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "./ui/input";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { useState } from "react";
import { Textarea } from "./ui/textarea";
import { useCategory } from "@/hooks/useHookItem";

const CreateNewCart = () => {
    const [preview, setPreview] = useState<string | null>(null);
    const { data: categories, isLoading, isError } = useCategory();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <h1 className="text-2xl font-semibold mb-6">Create New Item Gallery</h1>
            <form className="flex flex-col gap-5 w-full max-w-md bg-white py-3 px-6 rounded-xl shadow-md">
                <div className="flex flex-col">
                    <label htmlFor="title" className="mb-2 font-medium">Title: </label>
                    <Input name="title" type="text" placeholder="Enter title ..." />
                </div>
                <div className="flex items-center gap-4">
                    <label htmlFor="category" className="font-medium">Category: </label>
                    {isLoading ? (
                        <div>Loading categories...</div>
                    ) : isError ? (
                        <div>Error loading categories</div>
                    ) : (
                        <Select value={selectedCategory || undefined} onValueChange={(value) => setSelectedCategory(value)}>
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
                    <label htmlFor="picture" className="mb-2 font-medium">Image: </label>
                    <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-3 hover:border-blue-500 transition">
                        {preview ? (
                            <img src={preview} alt="Preview image" className="w-40 h-40 object-cover rounded-lg" />
                        ) : (
                            <>
                                <FontAwesomeIcon icon={faCloudArrowUp} className="text-4xl text-gray-500 mb-2" />
                                <span className="text-gray-500">Click to upload</span>
                            </>
                        )}
                        <Input id="picture" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        <label htmlFor="picture" className="absolute inset-0 cursor-pointer"></label>
                    </div>
                </div>
                <div className="flex flex-col">
                    <label htmlFor="tags" className="mb-2 font-medium">Tags: </label>
                    <Input name="tags" type="text" placeholder="Enter tags ..." />
                </div>
                <div className="flex flex-col">
                    <label htmlFor="description" className="mb-2 font-medium">Description: </label>
                    <Textarea name="description" placeholder="Enter description ..." />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className=" text-white py-2 px-5 rounded-lg duration-300 transition-colors bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500">Create</button>
                </div>
            </form>
        </div>
    )
}

export default CreateNewCart;