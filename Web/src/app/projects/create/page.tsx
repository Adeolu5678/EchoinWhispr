'use client';

import { useState } from 'react';
import { useMutation, useAction } from 'convex/react';
import { api } from '@convex/_generated/api';
import { useRouter } from 'next/navigation';
import { Upload, Check, ChevronRight, ChevronLeft } from 'lucide-react';

export default function CreateProjectPage() {
  const router = useRouter();
  const createProject = useMutation(api.projects.create);
  const generateUploadUrl = useAction(api.fileStorage.generateUploadUrl);

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    tagline: '',
    industry: '',
    description: '',
    fundingGoal: '',
    equityOffered: '',
    logoUrl: '',
    pitchDeckUrl: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'logoUrl' | 'pitchDeckUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      // 1. Get upload URL
      const postUrl = await generateUploadUrl();
      
      // 2. Upload file
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      const { storageId } = await result.json();
      
      // 3. Save storageId
      setFormData((prev) => ({ ...prev, [field]: storageId }));
    } catch (error) {
      console.error("Upload failed:", error);
      alert("Upload failed. Please try again.");
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const projectId = await createProject({
        title: formData.title,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        fundingGoal: Number(formData.fundingGoal),
        equityOffered: Number(formData.equityOffered),
        logoUrl: formData.logoUrl,
        pitchDeckUrl: formData.pitchDeckUrl,
      });
      
      router.push(`/projects/${projectId}`);
    } catch (error) {
      console.error("Failed to create project:", error);
      alert("Failed to create project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Forge Your Project
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Step {step} of 4
          </p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 rounded-full h-2.5">
          <div 
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
            style={{ width: `${(step / 4) * 100}%` }}
          ></div>
        </div>

        <div className="bg-slate-900 shadow-xl rounded-lg p-8 border border-slate-800">
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Essentials</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300">Project Name</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g. Acme Corp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Tagline</label>
                <input
                  type="text"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="The Uber for X"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Industry</label>
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="">Select an industry</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Health">Health</option>
                  <option value="AI">AI</option>
                  <option value="Consumer">Consumer</option>
                  <option value="B2B">B2B</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Logo</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-400">
                      <label htmlFor="logo-upload" className="relative cursor-pointer bg-slate-900 rounded-md font-medium text-indigo-500 hover:text-indigo-400 focus-within:outline-none">
                        <span>Upload a file</span>
                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={(e) => handleFileUpload(e, 'logoUrl')} />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    {formData.logoUrl && <p className="text-green-500 text-xs mt-2">Logo uploaded!</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">The Pitch</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300">Description (Problem & Solution)</label>
                <textarea
                  name="description"
                  rows={6}
                  value={formData.description}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Describe the problem you are solving and your unique solution..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Pitch Deck (PDF)</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-700 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-slate-400" />
                    <div className="flex text-sm text-slate-400">
                      <label htmlFor="deck-upload" className="relative cursor-pointer bg-slate-900 rounded-md font-medium text-indigo-500 hover:text-indigo-400 focus-within:outline-none">
                        <span>Upload a PDF</span>
                        <input id="deck-upload" name="deck-upload" type="file" accept=".pdf" className="sr-only" onChange={(e) => handleFileUpload(e, 'pitchDeckUrl')} />
                      </label>
                    </div>
                    {formData.pitchDeckUrl && <p className="text-green-500 text-xs mt-2">Deck uploaded!</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">The Ask</h3>
              
              <div>
                <label className="block text-sm font-medium text-slate-300">Funding Goal ($)</label>
                <input
                  type="number"
                  name="fundingGoal"
                  value={formData.fundingGoal}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="1000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300">Equity Offered (%)</label>
                <input
                  type="number"
                  name="equityOffered"
                  value={formData.equityOffered}
                  onChange={handleChange}
                  className="mt-1 block w-full bg-slate-800 border border-slate-700 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="10"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-xl font-medium text-white">Review & Publish</h3>
              
              <div className="bg-slate-800 rounded-md p-4 space-y-2">
                <p><span className="text-slate-400">Project:</span> {formData.title}</p>
                <p><span className="text-slate-400">Tagline:</span> {formData.tagline}</p>
                <p><span className="text-slate-400">Industry:</span> {formData.industry}</p>
                <p><span className="text-slate-400">Goal:</span> ${formData.fundingGoal} for {formData.equityOffered}%</p>
              </div>

              <div className="bg-indigo-900/30 border border-indigo-500/30 rounded-md p-4">
                <p className="text-sm text-indigo-200">
                  Publishing this project will automatically create a <strong>Workspace</strong> where you can invite your team and chat with investors.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <button
                onClick={() => setStep(step - 1)}
                className="flex items-center px-4 py-2 border border-slate-600 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800"
              >
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </button>
            ) : (
              <div></div>
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex items-center px-4 py-2 bg-indigo-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-indigo-700"
              >
                Next <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-green-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
              >
                {isSubmitting ? 'Publishing...' : 'Publish Project'} <Check className="ml-2 h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
