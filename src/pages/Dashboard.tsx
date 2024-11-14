import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Session } from "@supabase/supabase-js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface FileData {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  created_at: string;
  file_path: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [files, setFiles] = useState<FileData[]>([]);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/login");
        return;
      }
      setSession(session);
      fetchFiles();
      checkAdminStatus(session.user.id);
    });
  }, [navigate]);

  const checkAdminStatus = async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error checking admin status:", error);
      return;
    }

    setIsAdmin(data?.is_admin || false);
  };

  const fetchFiles = async () => {
    const { data, error } = await supabase
      .from("files")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Error fetching files");
      return;
    }

    setFiles(data || []);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const filePath = `${crypto.randomUUID()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('ixso-files')
        .upload(filePath, file);

      if (uploadError) {
        toast.error("Error uploading file");
        return;
      }

      // Save file metadata to database
      const { error: dbError } = await supabase
        .from('files')
        .insert({
          filename: file.name,
          file_path: filePath,
          content_type: file.type,
          size: file.size,
          user_id: session?.user.id
        });

      if (dbError) {
        toast.error("Error saving file metadata");
        return;
      }

      toast.success("File uploaded successfully");
      fetchFiles();
    } catch (error) {
      toast.error("Error uploading file");
    }
  };

  const downloadFile = async (filePath: string, fileName: string) => {
    const { data, error } = await supabase.storage
      .from("ixso-files")
      .download(filePath);

    if (error) {
      toast.error("Error downloading file");
      return;
    }

    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success("File downloaded successfully");
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "N/A";
    const units = ["B", "KB", "MB", "GB"];
    let size = bytes;
    let unitIndex = 0;
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gradient">IXSO Dashboard</h1>
        
        <div className="glass-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Available Files</h2>
            {isAdmin && (
              <div>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <label htmlFor="file-upload">
                  <Button
                    variant="outline"
                    className="cursor-pointer flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload File
                  </Button>
                </label>
              </div>
            )}
          </div>
          
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date Added</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file) => (
                <TableRow key={file.id}>
                  <TableCell>{file.filename}</TableCell>
                  <TableCell>{file.content_type || "N/A"}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => downloadFile(file.file_path, file.filename)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;