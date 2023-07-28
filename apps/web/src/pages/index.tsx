import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { api } from '@/utils/api'

const HomePage = () => {
  const { data: topics } = api.topic.all.useQuery()

  const { data: discussions } = api.discussion.all.useInfiniteQuery({
    page: 1,
    perPage: 10,
  })

  console.log(discussions)

  return (
    <div className="grid-cols-7 gap-6 space-y-6 md:grid md:space-y-0">
      <div className="col-span-2 space-y-3 overflow-hidden">
        <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          LEFT
        </div>
      </div>
      <div className="col-span-5 overflow-hidden">
        <div className="bg-white p-6 text-gray-900 shadow-sm sm:rounded-lg">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Topic" defaultValue="all" />
            </SelectTrigger>
            <SelectContent>
              {topics?.map((topic) => (
                <SelectItem key={topic.id} value={topic.id.toString()}>
                  {topic.name}
                </SelectItem>
              ))}
              <SelectItem value="all">All</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

export default HomePage
