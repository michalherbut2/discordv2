import React from 'react'
import { User } from 'lucide-react'
import { cn } from '../../utils/helpers'

interface AvatarProps {
  src?: string
  alt?: string
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  status?: 'online' | 'away' | 'busy' | 'offline'
  className?: string
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = 'Avatar',
  size = 'md',
  status,
  className
}) => {
  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  }

  const statusColors = {
    online: 'bg-green-500',
    away: 'bg-yellow-500',
    busy: 'bg-red-500',
    offline: 'bg-gray-500'
  }

  return (
    <div className={cn("relative", className)}>
      <div
        className={cn(
          "rounded-full bg-gray-600 flex items-center justify-center overflow-hidden",
          sizeClasses[size]
        )}
      >
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
          />
        ) : (
          <User className="w-1/2 h-1/2 text-gray-400" />
        )}
      </div>
      {status && (
        <div
          className={cn(
            "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-gray-800",
            statusColors[status]
          )}
        />
      )}
    </div>
  )
}

export default Avatar