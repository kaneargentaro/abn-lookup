import {
    Building2,
    Calendar,
    CheckCircle2,
    MapPin,
    XCircle,
} from 'lucide-react';
import { ABNEntity } from '@/types/api.types';

interface SearchResultCardProps {
    entity: ABNEntity;
}

export function SearchResultCard({ entity }: SearchResultCardProps) {
    return (
        <div
            key={entity.abn}
            className="bg-card border border-border rounded-lg p-6 hover:border-accent hover:shadow-md transition-all"
        >
            {/* Entity Name & Status */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-card-foreground mb-1">
                        {entity.name}
                    </h3>
                    <div className="flex items-center gap-2">
                        {entity.status === 'Active' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                        ) : (
                            <XCircle className="w-4 h-4 text-destructive" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                entity.status === 'Active'
                                    ? 'text-green-600'
                                    : 'text-destructive'
                            }`}
                        >
                            {entity.status}
                        </span>
                    </div>
                </div>
            </div>

            {/* ABN */}
            <div className="mb-3">
                <span className="text-sm text-muted-foreground">ABN:</span>
                <span className="ml-2 text-base font-mono text-foreground">
                    {entity.abn.replace(
                        /(\d{2})(\d{3})(\d{3})(\d{3})/,
                        '$1 $2 $3 $4'
                    )}
                </span>
            </div>

            {/* Entity Type */}
            <div className="mb-3 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    {entity.entityType}
                </span>
            </div>

            {/* Registration Date */}
            <div className="mb-3 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                    Registered:{' '}
                    {new Date(entity.registrationDate).toLocaleDateString(
                        'en-AU',
                        {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        }
                    )}
                </span>
            </div>

            {/* Location */}
            {entity.address && (
                <div className="mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                        {entity.address.state} {entity.address.postcode}
                    </span>
                </div>
            )}

            {/* GST Status */}
            {entity.gst && (
                <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center gap-2">
                        {entity.gst.registered ? (
                            <>
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                                <span className="text-sm text-green-600 font-medium">
                                    GST Registered
                                </span>
                            </>
                        ) : (
                            <>
                                <XCircle className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">
                                    Not registered for GST
                                </span>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
