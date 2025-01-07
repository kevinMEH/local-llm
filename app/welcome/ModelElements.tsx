import Image from "next/image";
import { HFRepo } from "../api/server_models";
import { bytesToReadable, ModelEntry, numberToReadable } from "../api/client_models";
import { useEffect, useState } from "react";
import HeartIcon from "@/design/icons/HeartIcon";
import DownloadIcon from "@/design/icons/DownloadIcon";

function ElementTemplate({ id, className = "", children }: { id: string, className?: string, children: React.ReactNode }) {
    const [ avatarUrl, setAvatarUrl ] = useState<string | undefined>(undefined);
    const repoOwner = id.substring(0, id.indexOf("/"));
    useEffect(() => {
        (async () => {
            setAvatarUrl(undefined);
            const response = await fetch(`https://huggingface.co/api/organizations/${repoOwner}/avatar`);
            const data = await response.json();
            if(data.avatarUrl) {
                setAvatarUrl(data.avatarUrl as string);
            } else {
                const response = await fetch(`https://huggingface.co/api/users/${repoOwner}/avatar`);
                const data = await response.json();
                if(data.avatarUrl) {
                    setAvatarUrl(data.avatarUrl as string);
                }
            }
        })();
    }, [repoOwner]);

    return <div className="border border-highlight first:mt-0 -mt-[1px]
    first:rounded-t-md last:rounded-b-md px-5 py-3 flex gap-5 min-w-0">
        <div className="flex items-center shrink-0">
            {
                avatarUrl
                ?  <Image unoptimized className="rounded-md" src={avatarUrl} alt={`${repoOwner}'s avatar`} width={40} height={40} />
                : <div className="rounded-full border box-content border-highlight w-10 h-10" />
            }
        </div>
        <div className={`text-left min-w-0 *:overflow-hidden *:text-ellipsis whitespace-nowrap ${className}`}>
            { children }
        </div>
    </div>
}

export function DownloadedModelElement({ repo }: { repo: HFRepo }) {
    const { repo_id, size_on_disk, nb_files, last_accessed } = repo;
    const lastAccessedDate = new Date(last_accessed * 1000);
    const readableSizeOnDisk = bytesToReadable(size_on_disk);
    
    return <ElementTemplate id={repo_id}>
        <h3 className="font-mono text-sm min-w-0">{repo_id}</h3>
        <p className="text-xs text-quiet">{`Last accessed: ${lastAccessedDate.toLocaleString()}`}</p>
        <p className="text-xs text-quiet">{nb_files} files occupying {readableSizeOnDisk}</p>
    </ElementTemplate>
}

export function ListedModelElement({ model, downloaded }: { model: ModelEntry, downloaded: boolean }) {
    const { id, likes, downloads } = model;
    
    return <ElementTemplate id={id} className={`space-y-1 ${downloaded ? "opacity-50" : ""}`}>
        <h3 className={`font-mono text-sm min-w-0`}>{id}</h3>
        <div className={`text-xs flex gap-3 text-quiet items-center`}>
            { downloaded && <span className="px-1.5 py-1 rounded-md bg-bg-mid text-xs">
                downloaded
            </span> }
            <span className="flex gap-1 items-center">
                <HeartIcon size={14} />
                <span>{ numberToReadable(likes) }</span>
            </span>
            <span className="flex gap-1 items-center">
                <DownloadIcon size={14} />
                <span>{ numberToReadable(downloads) }</span>
            </span>
        </div>
    </ElementTemplate>
}