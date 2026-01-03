export default function Home(){
  let fName= "yaek"
  return(
    <div>
      <form >
        <div className="flex gap-5">
        
        <label htmlFor="">name</label>
        <input type="text" name="fName"  className="border border-5 border-info rounded-sm" required />
        </div>
      </form>
    </div>
  )
} 