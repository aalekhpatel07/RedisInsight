import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class DatabaseOverview {
  @ApiProperty({
    description: 'Redis database version',
    type: String,
  })
  version: string;

  @ApiPropertyOptional({
    description: 'Total number of bytes allocated by Redis primary shards',
    type: Number,
  })
  usedMemory?: number;

  @ApiPropertyOptional({
    description: 'Total number of keys inside Redis primary shards',
    type: Number,
  })
  totalKeys?: number;

  @ApiPropertyOptional({
    description: 'Median for connected clients in the all shards',
    type: Number,
  })
  connectedClients?: number;

  @ApiPropertyOptional({
    description: 'Sum of current commands per second in the all shards',
    type: Number,
  })
  opsPerSecond?: number;

  @ApiPropertyOptional({
    description: 'Sum of current network input in the all shards (kbps)',
    type: Number,
  })
  networkInKbps?: number;

  @ApiPropertyOptional({
    description: 'Sum of current network out in the all shards (kbps)',
    type: Number,
  })
  networkOutKbps?: number;

  @ApiPropertyOptional({
    description: 'Sum of current cpu usage in the all shards (%)',
    type: Number,
  })
  cpuUsagePercentage?: number;
}
